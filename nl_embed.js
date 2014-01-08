/*jslint
 white: true, indent: 2, plusplus: true, browser: true
 */

/*global
 Neighborland
 */

if (typeof Neighborland === "undefined") {
  var Neighborland = {};
}

/*
 * EmbedRenderer contains methods that generate the HTML for the
 * read only neighborland embed.
 */
Neighborland.EmbedRenderer = (function() {
  'use strict';

  var escapeHTML = function(value) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },

  renderFancy = function(idea) {
    var txt = "";
    if (idea.i_want_text !== null) {
      txt += "<div class='idea' id='" + idea.id + "'><div class='ideatext'><a href='" + idea.alternate_url + "'>&ldquo;" + escapeHTML(idea.i_want_text) + "&rdquo;</a></div>";
      txt += "<div class='embed-pointer'></div>";
    }
    txt += "<div class='embed-meta clearfix'><div class='embed-sayer'><img src='" + idea.neighbor.avatar_thumb_url + "' width='36' height='36' /></div>";
    txt += "<div class='embed-says'>says <a href='" + idea.neighbor.alternate_url + "'>" + escapeHTML(idea.neighbor.name) + "</a> in <a href='" + idea.city.alternate_url + "'>" + escapeHTML(idea.city.name) + ", " + escapeHTML(idea.city.state) + "</a><br />";
    txt += "<span class='embed-support'><strong>" + idea.support_count;
    txt += idea.support_count === 1 ? "</strong> neighbor wants it</span></div></div>" : "</strong> neighbors want it</span></div></div>";
    txt += "</div>";
    txt += "</div>";
    return txt;
  },

  renderCompact = function(idea) {
    var txt = "";
    txt += "<div class='idea clearfix' id='" + idea.id + "'>";
    txt += "<div class='embed-sayer-compact'><img src='" + idea.neighbor.avatar_thumb_url + "' width='36' height='36' /></div>";
    txt += "<div class='compact-wrap'>";
    if (idea.i_want_text !== null) {
      txt += "<div class='ideatext-compact'><a href='" + idea.alternate_url + "'>&ldquo;" + escapeHTML(idea.i_want_text) + "&rdquo;</a></div>";
    }
    txt += "<div class='embed-meta-compact'>says <a href='" + idea.neighbor.alternate_url + "'>" + escapeHTML(idea.neighbor.name) + "</a> in <a href='" + idea.city.alternate_url + "'>" + escapeHTML(idea.city.name) + ", " + escapeHTML(idea.city.state) + "</a>";
    txt += " / <strong>" + idea.support_count;
    txt += idea.support_count === 1 ? "</strong> wants it</div>" : "</strong> want it</div>";
    txt += "</div>";
    txt += "</div>";
    return txt;
  };

  return {
    renderIdeas: function(ideas, options) {
      var txt = "", i;
      txt += this.renderTitle(ideas, options);
      for (i = 0; i < ideas.length; i++) {
        switch (options.style) {
          case 'compact':
            txt += renderCompact(ideas[i]);
            break;
          case 'fancy':
            txt += renderFancy(ideas[i]);
            break;
        }
      }
      txt += "<div class='widget-footer clearfix'>Powered by <a href='https://neighborland.com'>Neighborland</a></div>";
      return txt;
    },

    renderTitle: function(ideas, options) {
      var txt = "";
      if (ideas.length > 0 && options.context !== 'question') {
        txt += "<div class='clearfix widget-title-" + options.style + "'>";
        switch (options.context) {
          case 'city':
            txt += "Ideas in " + escapeHTML(ideas[0].city.name);
            break;
          case 'neighborhood':
            txt += "Ideas in " + escapeHTML(ideas[0].neighborhood.name) + ", " + escapeHTML(ideas[0].city.name);
            break;
          case 'neighbor':
            txt += "Ideas from " + escapeHTML(ideas[0].neighbor.name);
            break;
        }
        txt += "</div>";
      }
      return txt;
    },

    renderQuestionTitle: function(question, options) {
      var txt = "";
      txt += "<div class='clearfix widget-title-" + options.style + "'>";
      txt += escapeHTML(question.question_text);
      txt += "</div>";
      return txt;
    }
  };
}());

Neighborland.embedUrlBuilder = function(base_url) {
  'use strict';
  var content_url = base_url + 'api/v1/',

  isString = function(value) {
    if (!value) { return false; }
    if (typeof (value) !== 'string') { return false; }
    return value.length >= 1;
  },

  buildQueryString = function(options, omitCallback) {
    var query_string = "";
    if (options) {
      if (options.limit && (options.limit > 0)) {
        query_string += "?per_page=" + options.limit;
      } else {
        query_string += "?per_page=5";
      }
      if (isString(options.filter)) {
        query_string += "&filter=" + encodeURIComponent(options.filter);
      }
    }

    if (!omitCallback) {
      if (options && options.rootId) {
        query_string += "&callback=" + options.rootId + ".serverResponse";
      } else {
        query_string += "&callback=NlEmbed.serverResponse";
      }
    }
    return query_string;
  };

  return {
    //idea URLs

    cityUrl: function(city, options, omitCallback) {
      if (!city || !isString(city)) { return; }
      return content_url + "cities/" + encodeURIComponent(city) + "/ideas" + buildQueryString(options, omitCallback);
    },

    questionUrl: function(question, options, omitCallback) {
      if (!question || !isString(question)) { return; }
      return content_url + "questions/" + encodeURIComponent(question) + "/ideas" + buildQueryString(options, omitCallback);
    },

    neighborhoodUrl: function(neighborhood, options, omitCallback) {
      if (!neighborhood || !isString(neighborhood)) { return; }
      return content_url + "neighborhoods/" + encodeURIComponent(neighborhood) + "/ideas" + buildQueryString(options, omitCallback);
    },

    neighborUrl: function(neighbor, options, omitCallback) {
      if (!neighbor || !isString(neighbor)) { return; }
      return content_url + "neighbors/" + encodeURIComponent(neighbor) + "/ideas" + buildQueryString(options, omitCallback);
    },

    //single-item detail URLs (for second-round API calls)

    oneQuestionUrl: function(question, options) {
      if (!question || !isString(question)) { return; }
      if (options && options.rootId) {
        return content_url + "questions/" + encodeURIComponent(question) + "?callback=" + options.rootId + ".questionResponse";
      }
      else {
        return content_url + "questions/" + encodeURIComponent(question) + "?callback=NlEmbed.questionResponse";
      }
    }
  };
};

Neighborland.nlEmbedBuilder = function(base_url) {
  'use strict';

  var urlBuilder = Neighborland.embedUrlBuilder(base_url);

  function requestStylesheet(stylesheet_url) {
    var stylesheet, node;
    stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.type = "text/css";
    stylesheet.href = stylesheet_url;
    stylesheet.media = "all";
    node = document.lastChild;
    while (node.nodeType !== 1) { node = node.previousSibling; }
    node = node.firstChild;
    while (node.nodeType !== 1) { node = node.nextSibling; }
    node.appendChild(stylesheet);
  }

  function requestContent(url) {
    var script = document.createElement('script');
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  function getRootId(options) {
    if (!options) { return 'nl_embed'; }
    if (!options.rootId) { return 'nl_embed'; }
    return options.rootId;
  }

  function renderWidget(url, options) {
    requestStylesheet(base_url + "assets/nl_embed.css?cachebuster=2");
    document.write("<div class='neighborland_embed' id='" + getRootId(options) + "' style='display: none'></div>");
    requestContent(url);
    var no_script = document.getElementById('no_script');
    if (no_script) { no_script.style.display = 'none'; }
  }

  function getStyle(options) {
    if (!options) { return 'fancy'; }
    if (!options.style) { return 'fancy'; }
    return options.style;
  }

  function getwidth(options) {
    if (!options) { return '330px'; }
    if (!options.width) { return '330px'; }
    return options.width;
  }

  return {

    /**
     * NlEmbed.cityIdeas(city[, options])
     * - @param {string} city The city containing the ideas.
     * - @param {hash} options Options for filtering ideas.
     *
     * Valid optional arguments:
     * - filter: ("popular" | "new")
     * - style:  ("compact")
     * - rootId (string - what is the name of the div into which the embed will be placed?)
     * - limit (int - how many ideas should be rendered?)
     *
     * If no filter is specified, "new" is used.
     * If no style is specified, the full-size embed is rendered.
     * If no rootId is specified, "nl_embed" is used.
     * If no limit is specified, 5 ideas are rendered.
     *
     * Example: Get popular ideas from New Orleans
     *   NlEmbed.cityIdeas("nola", {filter: "popular"});
     **/

    cityIdeas: function(city, options) {
      var url = urlBuilder.cityUrl(city, options);
      this.serverResponse = function(data) {
        this.renderIdeas(data, { style: getStyle(options), context: 'city', width: getwidth(options), rootId: getRootId(options) });
      };
      renderWidget(url, options);
    },

    /**
     * NlEmbed.questionIdeas(question[, options])
     * - @param {string} question The question containing the ideas.
     * - @param {hash} options Options for filtering ideas.
     *
     * Valid optional arguments:
     * - filter: ("popular" | "new")
     * - style:  ("compact")
     * - rootId (string - what is the name of the div into which the embed will be placed?)
     * - limit (int - how many ideas should be rendered?)
     *
     * If no filter is specified, "new" is used.
     * If no style is specified, the full-size embed is rendered.
     * If no rootId is specified, "nl_embed" is used.
     * If no limit is specified, 5 ideas are rendered.
     *
     * Example: Get popular ideas from the "healthyfoods" question
     *   NlEmbed.questionIdeas("healthyfoods", {filter: "popular"});
     **/
    questionIdeas: function(question, options) {
      var qurl, url = urlBuilder.questionUrl(question, options);
      this.serverResponse = function(data) {
        this.renderIdeas(data, { style: getStyle(options), context: 'question', width: getwidth(options), rootId: getRootId(options) });
      };
      qurl = urlBuilder.oneQuestionUrl(question, options);
      this.questionResponse = function(data) {
        this.renderQuestionTitle(data, { style: getStyle(options), context: 'question', width: getwidth(options), rootId: getRootId(options) });
      };
      renderWidget(url, options);
      requestContent(qurl);
    },

    /**
     * NlEmbed.neighborhoodIdeas(neighborhood[, options])
     * - @param {string} neighborhood The neighborhood containing the ideas.
     * - @param {hash} options Options for filtering ideas.
     *
     * Valid optional arguments:
     * - filter: ("popular" | "new")
     * - style:  ("compact")
     * - rootId (string - what is the name of the div into which the embed will be placed?)
     * - limit (int - how many ideas should be rendered?)
     *
     * If no filter is specified, "new" is used.
     * If no style is specified, the full-size embed is rendered.
     * If no rootId is specified, "nl_embed" is used.
     * If no limit is specified, 5 ideas are rendered.
     *
     * Example: Get popular ideas from the French Quarter neighborhood in New Orleans
     *   NlEmbed.neighborhoodIdeas("nola-french-quarter", {filter: "popular"});
     **/
    neighborhoodIdeas: function(neighborhood, options) {
      var url = urlBuilder.neighborhoodUrl(neighborhood, options);
      this.serverResponse = function(data) {
        this.renderIdeas(data, { style: getStyle(options), context: 'neighborhood', width: getwidth(options), rootId: getRootId(options) });
      };
      renderWidget(url, options);
    },

    /**
     * NlEmbed.neighborIdeas(neighbor[, options])
     * - @param {string} neighbor The neighbor who created the ideas.
     * - @param {hash} options Options for filtering ideas.
     *
     * Valid optional arguments:
     * - filter: ("popular" | "new")
     * - style:  ("compact")
     * - rootId (string - what is the name of the div into which the embed will be placed?)
     * - limit (int - how many ideas should be rendered?)
     *
     * If no filter is specified, "new" is used.
     * If no style is specified, the full-size embed is rendered.
     * If no rootId is specified, "nl_embed" is used.
     * If no limit is specified, 5 ideas are rendered.
     *
     * Example: Get ideas by "candy" with default options.
     *   NlEmbed.neighborIdeas("candy");
     **/
    neighborIdeas: function(neighbor, options) {
      var url = urlBuilder.neighborUrl(neighbor, options);
      this.serverResponse = function(data) {
        this.renderIdeas(data, { style: getStyle(options), context: 'neighbor', width: getwidth(options), rootId: getRootId(options) });
      };
      renderWidget(url, options);
    },

    renderQuestionTitle: function(data, options) {
      if (!data) { return; }
      var div = document.getElementById(options.rootId), title = "",
              ideas = div.innerHTML;
      title = Neighborland.EmbedRenderer.renderQuestionTitle(data, options);
      div.innerHTML = title + ideas;
    },

    renderIdeas: function(data, options) {
      if (!data) { return; }
      var div = document.getElementById(options.rootId), txt = "";
      txt = Neighborland.EmbedRenderer.renderIdeas(data, options);
      div.innerHTML = div.innerHTML + txt;  // assign new HTML into #ROOT
      div.style.width = options.width;
      div.style.display = 'block'; // make element visible
      div.style.visibility = 'visible'; // make element visible
    }
  };
};

var NlEmbed = Neighborland.nlEmbedBuilder("https://neighborland.com/");
