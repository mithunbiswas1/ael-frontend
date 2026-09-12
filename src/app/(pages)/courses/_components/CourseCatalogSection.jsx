// src/app/(pages)/courses/_components/CourseCatalogSection.jsx
import CourseCatalogInteractive, {
  CATEGORIES,
  COURSE_CATALOG,
} from "../_client/CourseCatalogInteractive";

export { CATEGORIES, COURSE_CATALOG };

export default function CourseCatalogSection() {
  return <CourseCatalogInteractive />;
}
