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
        key: "start-registration",
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
        key: "check-player-approval",
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
        key: "create-profile",
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
        key: "create-identity",
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
        key: "create-wallet",
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
        key: "check-kyc",
        displayName: "Check KYC",
        flowKind: "success",
        fig: "RoundedRectangle"
      },
      log: {
        level: "Warning",
        messageRegex: /KYC Result:/,
        type: "kycservice"
      }
    },
    {
      render: {
        key: "signal-registration-completed",
        displayName: "Signal Registration Completed",
        flowKind: "success",
        fig: "RoundedRectangle"
      },
      log: {
        level: "Debug",
        messageRegex: /Publishing digital registration complete event for/,
        type: "registration"
      }
    },
    {
      render: {
        key: "registration-completed",
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
        key: "registration-failed",
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
        key: "delete-profile",
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
        key: "delete-identity",
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
        key: "delete-wallet",
        displayName: "Delete Wallet",
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
        key: "create-es-profile",
        displayName: "Create ES Profile",
        flowKind: "async-success",
        fig: "RoundedRectangle"
      },
      log: {
        level: "Debug",
        messageRegex: /ElasticSearch upsert success/,
        type: "cemlog"
      }
    },
    {
      render: {
        key: "apply-registration-bonus",
        displayName: "Apply Registration Bonuses",
        flowKind: "async-success",
        fig: "RoundedRectangle"
      },
      log: {
        level: "Information",
        messageRegex: /player has no eligible player registration bonuses/,
        type: "BonusToolService"
      }
    },
    {
      render: {
        key: "delete-es-profile",
        displayName: "Delete ES Profile",
        flowKind: "async-fail",
        fig: "RoundedRectangle"
      },
      log: {
        level: "",
        messageRegex: /ggghg/,
        type: ""
      }
    }
  ];

  const expectedEdges = [
    {
      from: "start-registration",
      to: "check-player-approval"
    },
    {
      from: "check-player-approval",
      to: "create-profile"
    },
    {
      from: "create-profile",
      to: "create-identity"
    },
    {
      from: "create-identity",
      to: "create-wallet"
    },
    {
      from: "create-wallet",
      to: "check-kyc"
    },
    {
      from: "check-kyc",
      to: "signal-registration-completed"
    },
    {
      from: "signal-registration-completed",
      to: "registration-completed"
    },
    {
      from: "check-player-approval",
      to: "registration-failed"
    },
    {
      from: "create-profile",
      to: "delete-profile"
    },
    {
      from: "delete-profile",
      to: "registration-failed"
    },
    {
      from: "create-identity",
      to: "delete-identity"
    },
    {
      from: "delete-identity",
      to: "delete-profile"
    },
    {
      from: "create-wallet",
      to: "delete-wallet"
    },
    {
      from: "delete-wallet",
      to: "delete-identity"
    },
    {
      from: "create-profile",
      to: "create-es-profile"
    },
    {
      from: "signal-registration-completed",
      to: "apply-registration-bonus"
    },
    {
      from: "delete-profile",
      to: "delete-es-profile"
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
