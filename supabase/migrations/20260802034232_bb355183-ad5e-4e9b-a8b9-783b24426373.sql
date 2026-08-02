GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_any_role(uuid, public.app_role[]) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.can_read_catalog(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.can_read_internal(uuid) TO authenticated, service_role;