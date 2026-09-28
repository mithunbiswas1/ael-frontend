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
    create: "blogs",
    update: (id) => `blogs/${id}`,
    delete: (id) => `blogs/${id}`,
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
};

