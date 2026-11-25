from django.contrib.admin.apps import AdminConfig


class ArenaAdminConfig(AdminConfig):
    default_site = "catalog.sites.ArenaAdminSite"
