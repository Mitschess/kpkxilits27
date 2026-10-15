import { useEffect } from "react";

const SITE = "Kampus Pulang Kampung";

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE}` : SITE;
  }, [title]);
}
