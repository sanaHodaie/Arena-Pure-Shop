from datetime import date, timedelta
from io import BytesIO
from random import Random
from zoneinfo import ZoneInfo

from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.utils import timezone
from django.views.decorators.http import require_GET
from openpyxl import Workbook
from openpyxl.chart import BarChart, LineChart, Reference
from openpyxl.styles import Font, PatternFill

from .panel_views import forbidden, staff_api


def report_dates(start, end):
    today = timezone.localdate(timezone=ZoneInfo("Asia/Tehran"))
    if start is None and end is None:
        return today.replace(day=1), today
    try:
        start, end = date.fromisoformat(start), date.fromisoformat(end)
    except (TypeError, ValueError):
        raise ValueError("تاریخ شروع و پایان معتبر وارد کنید.") from None
    if not (start <= end <= today) or (end - start).days > 365:
        raise ValueError("بازه باید حداکثر ۳۶۶ روز و تا تاریخ امروز باشد.")
    return start, end


def daily_sales(start, end, demo):
    """Demo figures are deterministic and never reach the order or payment tables."""
    for offset in range((end - start).days + 1):
        day = start + timedelta(days=offset)
        rng = Random(day.toordinal())
        orders = rng.randint(0, 21) if demo else 0
        yield {
            "date": day.isoformat(), "orders": orders,
            "revenue": orders * rng.randrange(440_000, 1_300_000, 10_000),
        }


def build_report(start, end):
    demo = settings.SALES_REPORT_DEMO
    days = list(daily_sales(start, end, demo))
    monthly = len(days) > 31
    grouped = {}
    for row in days:
        key = row["date"][:7] if monthly else row["date"]
        bucket = grouped.setdefault(key, {"date": key, "orders": 0, "revenue": 0})
        for metric in ("orders", "revenue"):
            bucket[metric] += row[metric]
    totals = {metric: sum(row[metric] for row in days) for metric in ("orders", "revenue")}
    return {
        "start": start.isoformat(), "end": end.isoformat(), "demo": demo,
        "days": days, "series": list(grouped.values()), "totals": totals,
        "interval": "month" if monthly else "day",
    }


def workbook_bytes(report):
    workbook = Workbook()
    summary = workbook.active
    summary.title = "خلاصه"
    daily = workbook.create_sheet("آمار روزانه")
    charts = workbook.create_sheet("نمودارها")
    state = "آزمایشی · دادهٔ ساختگی" if report["demo"] else "صفر · فروش آنلاین متصل نیست"
    for row in (
        ("وضعیت داده", state), ("شروع", report["start"]), ("پایان", report["end"]),
        ("فروش (تومان)", report["totals"]["revenue"]), ("تعداد سفارش", report["totals"]["orders"]),
    ):
        summary.append(row)
    for sheet, rows in ((daily, report["days"]), (charts, report["series"])):
        sheet.append(("تاریخ میلادی", "فروش (تومان)", "سفارش"))
        for row in rows:
            sheet.append((row["date"], row["revenue"], row["orders"]))
        sheet.freeze_panes = "B2"
        for cell in sheet[1]:
            cell.fill = PatternFill(patternType="solid", fgColor="50305F")
            cell.font = Font(color="FFFFFF", bold=True)
    for sheet in workbook.worksheets:
        sheet.sheet_view.rightToLeft = True
        sheet.column_dimensions["A"].width = 23
        sheet.column_dimensions["B"].width = 48 if sheet is summary else 20
        sheet.column_dimensions["C"].width = 14
    labels = Reference(charts, min_col=1, min_row=2, max_row=charts.max_row)
    for chart, col, title, color, anchor in (
        (LineChart(), 2, "روند درآمد · تومان", "7856D8", "E2"),
        (BarChart(), 3, "تعداد سفارش", "0B9B83", "E18"),
    ):
        chart.title = title
        chart.width = 24
        chart.add_data(Reference(charts, min_col=col, min_row=1, max_row=charts.max_row), titles_from_data=True)
        chart.set_categories(labels)
        chart.series[0].graphicalProperties.line.solidFill = color
        chart.series[0].graphicalProperties.solidFill = color
        charts.add_chart(chart, anchor)
    output = BytesIO()
    workbook.save(output)
    return output.getvalue()


@staff_api
@require_GET
def sales_report(request, export=False):
    if not request.user.has_perm("catalog.view_product"):
        return forbidden()
    try:
        start, end = report_dates(request.GET.get("start"), request.GET.get("end"))
    except ValueError as error:
        return JsonResponse({"error": str(error)}, status=400)
    report = build_report(start, end)
    if not export:
        return JsonResponse(report)
    prefix = "arena-demo-sales" if report["demo"] else "arena-sales"
    return HttpResponse(workbook_bytes(report), content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        headers={"Content-Disposition": f'attachment; filename="{prefix}-{start}-{end}.xlsx"'})
