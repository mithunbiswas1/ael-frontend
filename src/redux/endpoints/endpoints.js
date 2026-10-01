// src/redux/endpoints/endpoints.js

export const endpoints = {
  //Auth API
  auth: {
    registration: "register",
    login: "login",
    sendOtp: "new-otp",
    otpVerifyLogin: "otp-verify",
  },

  // Order endpoints
  order: {
    createOrder: "create-order",
  },

  //Product API
  product: {
    product: "product",
    search: "search",
  },

  //Product Review
  productReview: {
    productReview: "product-review",
  },

  //Profile API
  profile: {
    profile: "profile",
  },

  //Pages API
  pages: {
    contact: "contact",
  },

  //Setting API
  setting: {
    getSetting: "setting",
  },
  //Tracking API
  tracking: {
    getTracking: "track",
  },

  // Blogs API
  blogs: {
    publicList: "blogs",
    adminList: "blogs/admin/all",
    categories: "blogs/categories",
    getById: (id) => `blogs/${id}`,
    create: "blogs",
    update: (id) => `blogs/${id}`,
    delete: (id) => `blogs/${id}`,
  },

  // Market Updates API (Like Blogs)
  marketUpdates: {
    publicList: "market-updates",
    getBySlug: (slug) => `market-updates/detail/${slug}`,
    adminList: "market-updates/admin/all",
    getById: (id) => `market-updates/${id}`,
    create: "market-updates",
    update: (id) => `market-updates/${id}`,
    delete: (id) => `market-updates/${id}`,
  },

  // Roles & Permissions API
  roles: {
    list: "roles",
    myPermissions: "roles/my-permissions",
    create: "roles",
    update: (id) => `roles/${id}`,
    delete: (id) => `roles/${id}`,
  },

  // Courses API
  courses: {
    publicList: "courses",
    detail: (id) => `courses/${id}`,
    create: "courses",
    update: (id) => `courses/${id}`,
    delete: (id) => `courses/${id}`,
    subscriberMyLearning: "courses/subscriber/my-learning",
    subscriberEnroll: "courses/subscriber/enroll",
    uploadVideo: "courses/upload-video",
    uploadImage: "courses/upload-image",
    updateProgress: (id) => `courses/${id}/progress`,
  },

  // Quizzes API
  quizzes: {
    getByCourseId: (courseId) => `quizzes/course/${courseId}`,
    submit: "quizzes/submit",
    adminAll: "quizzes/admin/all",
    save: "quizzes/save",
    delete: (id) => `quizzes/${id}`,
  },

  // CMS Pages API
  cmsPages: {
    getBySlug: (slug) => `pages/${slug}`,
    list: "pages",
    update: (slug) => `pages/${slug}`,
  },

  // Contact Messages API
  contactMessages: {
    submit: "contact/messages",
    list: "contact/messages",
    updateStatus: (id) => `contact/messages/${id}`,
    delete: (id) => `contact/messages/${id}`,
  },

  // Dedicated Home Banner API
  homeBanner: {
    get: "home-banner",
    update: "home-banner",
    uploadSlides: "home-banner/upload-slides",
  },

  // Archives API
  archives: {
    publicList: "archives",
    detail: (id) => `archives/${id}`,
    trackDownload: (id) => `archives/${id}/download`,
    adminList: "archives/admin/all",
    create: "archives",
    update: (id) => `archives/${id}`,
    delete: (id) => `archives/${id}`,
  },

  // Campaigns (SMS & Email) API
  campaigns: {
    list: "campaigns",
    stats: "campaigns/stats",
    create: "campaigns",
    delete: (id) => `campaigns/${id}`,
  },

  // Subscriptions & Payment Gateway API
  subscriptions: {
    plans: "subscriptions/plans",
    checkout: "subscriptions/checkout",
    adminList: "subscriptions/admin/all",
    refund: (id) => `subscriptions/admin/${id}/refund`,
  },

  // Directory (Large Database) API
  directory: {
    list: "directory",
    stats: "directory/stats",
    create: "directory",
    update: (id) => `directory/${id}`,
    delete: (id) => `directory/${id}`,
    bulkImport: "directory/bulk-import",
  },
};

