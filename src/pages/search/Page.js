import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import { ReactDiagram } from "gojs-react";
import { SearchContext } from "../../cross-cutting/SearchLayout";
import { buildNodesFromLogHits, buildsGoDiagramFromNodes } from "./processor";

const useStyles = makeStyles(theme => ({
  waiting: {
    marginTop: "20px",
    padding: "10px"
  },
  loading: {
    marginTop: "20px"
  },
  page: {
    marginTop: "20px",
    padding: "10px"
  },
  diagram: {
    width: "100%",
    height: "400px"
  }
}));

export default function SearchPage() {
  const classes = useStyles();

  const [data, setData] = useState({ state: "no-data" });
  const { searchFilterState } = useContext(SearchContext);

  useEffect(() => {
    (async () => {
      if (!searchFilterState.searchBar) {
        setData({ state: "no-data" });
        return;
      }

      setData({ state: "is-loading" });
      const result = await fetch(
        "https://kibana.bedegaming.net/elasticsearch/log-bde_qa02-*/_search?timeout=10000&ignore_unavailable=true",
        {
          method: "POST",
          headers: {
            "kbn-xsrf-token": "kibana",
            "Content-Type": "application/json",
            accept: "application/json"
          },
          body: JSON.stringify({
            size: 500,
            sort: [
              {
                "@timestamp": {
                  order: "desc",
                  unmapped_type: "boolean"
                }
              }
            ],
            query: {
              filtered: {
                query: {
                  query_string: {
                    analyze_wildcard: true,
                    lowercase_expanded_terms: false,
                    query: `"${searchFilterState.searchBar}"`
                  }
                },
                filter: {
                  bool: {
                    must: [
                      {
                        range: {
                          "@timestamp": {
                            gte: Date.now() - 1000 * 60 * 120,
                            lte: Date.now()
                          }
                        }
                      }
                    ],
                    must_not: []
                  }
                }
              }
            }
          })
        }
      );
      console.log(result.body);
      setData({ ...(await result.json()), state: "has-data" });
    })();
  }, [searchFilterState.searchBar]);

  if (data.state === "no-data") {
    return <></>;
  }

  if (data.state === "is-loading") {
    return (
      <div className={classes.loading}>
        <LinearProgress color="secondary" />
      </div>
    );
  }

  console.log(data);

  const expectedNodes = [
    {
      render: {
        key: 1,
        displayName: "Start Registration",
        flowKind: "success",
        fig: "Ellipse"
      },
      log: {
        level: "Information",
        messageRegex: /\/api\/register/,
        type: "metrics"
      }
    },
    {
      render: {
        key: 2,
        displayName: "Check Player Approval",
        flowKind: "success",
        fig: "RoundedRectangle"
      },
      log: {
        level: "Information",
        messageRegex: /Player approval response: Player \[[0-9]+\] StatusCode \[Approved\]/,
        type: "unknown"
      }
    },
    {
      render: {
        key: 3,
        displayName: "Create Profile",
        flowKind: "success",
        fig: "RoundedRectangle"
      },
      log: {
        level: "Information",
        messageRegex: /RESPONSE: 201 "http:\/\/(.+)\/api\/profiles\/summary"/,
        type: "metrics"
      }
    },
    {
      render: {
        key: 4,
        displayName: "Create Identity",
        flowKind: "success",
        fig: "RoundedRectangle"
      },
      log: {
        level: "Information",
        messageRegex: /RESPONSE: 201 "http:\/\/(.+)\/api\/identity"/,
        type: "metrics"
      }
    },
    {
      render: {
        key: 5,
        displayName: "Create Wallet",
        flowKind: "success",
        fig: "RoundedRectangle"
      },
      log: {
        level: "Information",
        messageRegex: /RESPONSE: 201 "http:\/\/(.+)\/v4\/wallets"/,
        type: "metrics"
      }
    },
    {
      render: {
        key: 6,
        displayName: "Registration Completed",
        flowKind: "success",
        fig: "Ellipse"
      },
      log: {
        level: "Information",
        messageRegex: /RESPONSE: 201 "http:\/\/(.+)\/api\/register"/,
        type: "metrics"
      }
    },
    {
      render: {
        key: 7,
        displayName: "Registration Failed",
        flowKind: "failure",
        fig: "Ellipse"
      },
      log: {
        level: "",
        messageRegex: /jhshshshsh/,
        type: ""
      }
    },
    {
      render: {
        key: 8,
        displayName: "Delete Profile",
        flowKind: "failure",
        fig: "RoundedRectangle"
      },
      log: {
        level: "",
        messageRegex: /jhshshshsh/,
        type: ""
      }
    },
    {
      render: {
        key: 9,
        displayName: "Delete Identity",
        flowKind: "failure",
        fig: "RoundedRectangle"
      },
      log: {
        level: "",
        messageRegex: /jhshshshsh/,
        type: ""
      }
    },
    {
      render: {
        key: 10,
        displayName: "Delete Wallet",
        flowKind: "failure",
        fig: "RoundedRectangle"
      },
      log: {
        level: "",
        messageRegex: /jhshshshsh/,
        type: ""
      }
    }
  ];

  const expectedEdges = [
    {
      from: 1,
      to: 2
    },
    {
      from: 2,
      to: 3
    },
    {
      from: 3,
      to: 4
    },
    {
      from: 4,
      to: 5
    },
    {
      from: 5,
      to: 6
    },
    {
      from: 2,
      to: 7
    },
    {
      from: 3,
      to: 8
    },
    {
      from: 8,
      to: 7
    },
    {
      from: 4,
      to: 9
    },
    {
      from: 9,
      to: 8
    },
    {
      from: 5,
      to: 10
    },
    {
      from: 10,
      to: 9
    }
  ];

  const nodes = buildNodesFromLogHits(
    searchFilterState.searchBar,
    expectedNodes,
    data.hits.hits
  );

  if (nodes.result && nodes.result === "error") {
    return (
      <Paper className={classes.page}>
        <p>{nodes.message}</p>
      </Paper>
    );
  }

  const nodesAndEdges = {
    nodeDataArray: nodes,
    linkDataArray: expectedEdges
  };

  return (
    <Paper className={classes.page}>
      <ReactDiagram
        initDiagram={buildsGoDiagramFromNodes}
        divClassName={classes.diagram}
        nodeDataArray={nodesAndEdges.nodeDataArray}
        linkDataArray={nodesAndEdges.linkDataArray}
      />
    </Paper>
  );
}
