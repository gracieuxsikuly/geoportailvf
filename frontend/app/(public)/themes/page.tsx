import { redirect } from 'next/navigation';

/** Redirection : les thématiques se consultent sur la carte (comme geo.be) */
export default function ThemesIndexPage() {
  redirect('/map');
}
