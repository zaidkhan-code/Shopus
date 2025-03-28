import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Drawer from "../Mobile/Drawer";
import Footer from "./Footers/Footer";
import Header from "./Headers/Header";
import DefaultUser from "../../contexts/DefaultUser";
export default function Layout({ children, childrenClasses }) {
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const [settings, setSettings] = useState(null);
  const [subscribeData, setSubScribeDAta] = useState(null);
  const [contact, setContact] = useState(null);
  const [defaultUser, setDefaultUser] = useState(null);
  useEffect(() => {
    const defaultUser = JSON.parse(localStorage.getItem("active-user"));
    setDefaultUser(defaultUser);
  }, []);
  const updateDefaultUserDate = () => {
    const defaultUser = JSON.parse(localStorage.getItem("active-user"));
    setDefaultUser(defaultUser);
  };

  useEffect(() => {
    if (!subscribeData) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}api/`)
        .then((res) => {
          if (res.data) {
            setSubScribeDAta(res.data.subscriptionBanner);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [subscribeData]);

  useEffect(() => {
    if (websiteSetup) {
      setSettings(websiteSetup.payload.setting);
    }
  }, [websiteSetup]);
  useEffect(() => {
    if (!contact) {
      if (websiteSetup) {
        setContact(websiteSetup.payload.footer);
      }
    }
  });

  const [drawer, setDrawer] = useState(false);
  return (
    <>
      <Drawer open={drawer} action={() => setDrawer(!drawer)} />
      <DefaultUser.Provider
        value={{ user: defaultUser, handler: updateDefaultUserDate }}
      >
        <div className="w-full overflow-x-hidden">
          <Header
            contact={contact && contact}
            settings={settings}
            drawerAction={() => setDrawer(!drawer)}
          />
          <div className={`w-full ${childrenClasses || "pt-[30px] pb-[60px]"}`}>
            {children && children}
          </div>
          <Footer contact={contact && contact} settings={settings} />
        </div>
      </DefaultUser.Provider>
    </>
  );
}
