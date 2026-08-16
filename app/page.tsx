import Nav from "@/app/components/site/Nav";
import Hero from "@/app/components/site/Hero";
import ShowsList from "@/app/components/site/ShowsList";
import Gallery from "@/app/components/site/Gallery";
import News from "@/app/components/site/News";
import Band from "@/app/components/site/Band";
import Merch from "@/app/components/site/Merch";
import Footer from "@/app/components/site/Footer";
import {
  getBandMembers,
  getGalleryItems,
  getMerchItems,
  getNewsPosts,
  getSiteSettings,
  getUpcomingShows,
} from "@/lib/data";

export const revalidate = 0;

export default async function HomePage() {
  const [settings, shows, gallery, news, band, merch] = await Promise.all([
    getSiteSettings(),
    getUpcomingShows(),
    getGalleryItems(),
    getNewsPosts(),
    getBandMembers(),
    getMerchItems(),
  ]);

  return (
    <>
      <Nav settings={settings} />
      <Hero settings={settings} band={band} />
      <ShowsList shows={shows} />
      <Gallery items={gallery} />
      <News posts={news} />
      <Band members={band} />
      <Merch items={merch} />
      <Footer settings={settings} />
    </>
  );
}
