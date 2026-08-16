import Nav from "@/app/components/site/Nav";
import Hero from "@/app/components/site/Hero";
import ShowsList from "@/app/components/site/ShowsList";
import Discography from "@/app/components/site/Discography";
import Gallery from "@/app/components/site/Gallery";
import News from "@/app/components/site/News";
import Band from "@/app/components/site/Band";
import Merch from "@/app/components/site/Merch";
import Enquiry from "@/app/components/site/Enquiry";
import Footer from "@/app/components/site/Footer";
import {
  getBandMembers,
  getDiscography,
  getGalleryItems,
  getMerchItems,
  getNewsPosts,
  getSiteSettings,
  getUpcomingShows,
} from "@/lib/data";

export const revalidate = 0;

export default async function HomePage() {
  const [settings, shows, discography, gallery, news, band, merch] = await Promise.all([
    getSiteSettings(),
    getUpcomingShows(),
    getDiscography(),
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
      <Discography tracks={discography} />
      <Gallery items={gallery} />
      <News posts={news} />
      <Band members={band} />
      <Merch items={merch} />
      <Enquiry />
      <Footer settings={settings} />
    </>
  );
}
