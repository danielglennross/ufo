import React from "react";
import { Switch, Route } from "react-router-dom";
import DefaultLayout from "../../src/cross-cutting/DefaultLayout";
import SearchLayout from "../../src/cross-cutting/SearchLayout";
import SideBar from "../../src/pages/search/SideBar";
import Page from "../../src/pages/search/Page";

function Test1() {
  return <p>hello world 1</p>;
}

export default function LayoutManager() {
  return (
    <Switch>
      <Route
        path="/design"
        render={() => (
          <DefaultLayout sideBarContent={SideBar} pageContent={Test1} />
        )}
      />
      <Route
        path="/"
        render={() => (
          <SearchLayout sideBarContent={SideBar} pageContent={Page} />
        )}
      />
    </Switch>
  );
}
