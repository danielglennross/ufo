import React from "react";
import SideBarTemplate from "../../src/cross-cutting/SideBarTemplate";
import ContentTemplate from "../../src/cross-cutting/ContentTemplate";

export default function DefaultLayout({
  sideBarContent: SideBarContent,
  pageContent: PageContent
}) {
  return (
    <>
      <SideBarTemplate>
        <SideBarContent />
      </SideBarTemplate>
      <ContentTemplate>
        <PageContent />
      </ContentTemplate>
    </>
  );
}
