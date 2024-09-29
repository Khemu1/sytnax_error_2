import React from "react";
import { footerLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer>
      <div className="main_info">
        <div className="left">
          <div className="footer_logo">
            <Image
              alt="logo"
              height={30}
              width={85}
              src="/assets/imgs/logo.png"
              className="object-contain"
            />
          </div>
          <div className="footer_rights">
            <div className="text-md font-lato">
              <p className="font-semibold text-white">
                {" "}
                Syntax Error {new Date().getFullYear()}
              </p>{" "}
              All Rights Reserved &copy;
            </div>
          </div>
        </div>
        <div className="links">
          {footerLinks.map((link) => (
            <div className="link_group" key={link.name}>
              <p className="mb-1 text-xl font-semibold font-lato text-white">
                {link.name}
              </p>
              {link.links.map(({ title, url }) => (
                <Link
                  href={url}
                  key={title}
                  className="transition-all hover:text-blue-400"
                >
                  {title}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="privay_terms">
        <div className="flex gap-2 text-lg font-lato  items-center">
          <p className="m-[0] font-lato font-semibold text-white">
            @{new Date().getFullYear()} Syntax Error.
          </p>{" "}
          All rights reserved
        </div>
        <div className="flex gap-3 font-lato  text-lg">
          <Link href="/" className=" ">
            Privacy & Policy
          </Link>
          <Link href="/" className=" ">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
