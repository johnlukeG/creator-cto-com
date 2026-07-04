import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/fsga/pack/", "/fsga/presenter", "/fsga/static", "/fsga/admin"],
    },
  };
}
