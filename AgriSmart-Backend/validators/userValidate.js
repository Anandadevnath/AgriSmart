import * as yup from "yup";

export const userSchema = yup.object().shape({
    name: yup.string().min(3).max(50).required("Name is required"),
    email: yup.string().email().required("Email is required"),
    phone: yup.string().min(7).max(20).required("Phone is required"),
    password: yup.string().min(6).max(20).required("Password must be 6 to 20 characters long"),
    preferredLanguage: yup.string().oneOf(["bn","en"]).optional(),
    location: yup.object().shape({
        division: yup.string().required("division is required"),
        district: yup.string().required("district is required"),
        upazila: yup.string().required("upazila is required")
    }).required("Location is required for a farmer")
});

// Convert empty strings to undefined so unselected form fields
// (e.g. empty avatar, unselected upazila) are treated as "not provided"
// instead of failing min/url validation.
const emptyToUndefined = (value) => (value === '' ? undefined : value);

export const userUpdateSchema = yup.object().shape({
    name: yup.string().transform(emptyToUndefined).min(3).max(50).optional(),
    phone: yup.string().transform(emptyToUndefined).min(7).max(20).optional(),
    preferredLanguage: yup.string().transform(emptyToUndefined).oneOf(["bn","en"]).optional(),
    avatar: yup.string().transform(emptyToUndefined).url().optional(),
    // Allow partial location updates: any of division/district/upazila may be provided
    location: yup.object().shape({
        division: yup.string().transform(emptyToUndefined).min(1).optional(),
        district: yup.string().transform(emptyToUndefined).min(1).optional(),
        upazila: yup.string().transform(emptyToUndefined).min(1).optional()
    }).optional().nullable()
});

// middleware factory: validate request body against the provided schema
export const validateUser = (schema) => (req, res, next) => {
    try {
        // validateSync applies transforms; use the cleaned body downstream so
        // empty strings are dropped before they reach the controller
        const validated = schema.validateSync(req.body, { abortEarly: false });
        req.body = validated;
        return next();
    } catch (err) {
        const errors = err.inner ? err.inner.map((e) => e.message) : [err.message];
        return res.status(400).json({ success: false, errors });
    }
};