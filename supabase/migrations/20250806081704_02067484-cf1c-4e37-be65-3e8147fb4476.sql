
-- Link the admin user to the default clinic
INSERT INTO public.user_clinic_access (
    user_id,
    clinic_id,
    role,
    is_active,
    created_by_admin
) VALUES (
    'c715d2e7-0d17-4734-bda7-345b0722aa1c',  -- Your admin user ID
    '00000000-0000-0000-0000-000000000001',  -- Default clinic ID
    'admin',
    true,
    'c715d2e7-0d17-4734-bda7-345b0722aa1c'   -- Self-created by admin
);
