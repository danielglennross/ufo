import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import { ReactDiagram } from "react-gojs";
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
                            gte: Date.now() - 1000 * 60 * 15,
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
        key: "1",
        displayName: "a",
        flowKind: "success"
      },
      log: {
        level: "Debug",
        messageRegex: "Sending message",
        type: "unknown"
      }
    },
    {
      render: {
        key: "2",
        displayName: "b",
        flowKind: "success"
      },
      log: {
        level: "Information",
        messageRegex: "Catalogue update event",
        type: "unknown"
      }
    }
  ];

  const expectedEdges = [
    {
      from: "1",
      to: "2"
    }
  ];

  const nodes = buildNodesFromLogHits(
    searchFilterState.searchBar,
    expectedNodes,
    data.hits.hits
  );

  const nodesAndEdges = {
    nodeDataArray: nodes,
    linkDataArray: expectedEdges
  };

  return (
    <Paper className={classes.page}>
      <ReactDiagram
        nodeDataArray={nodesAndEdges.nodeDataArray}
        linkDataArray={nodesAndEdges.linkDataArray}
        initDiagram={buildsGoDiagramFromNodes}
        //className="myDiagram"
        //onModelChange={this.modelChangedhandler}
        //updateDiagramProps={this.updateDiagramProps}
      />
    </Paper>
  );
}
