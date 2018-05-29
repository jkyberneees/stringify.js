/* http://json.org/example.html */

module.exports = {
  'servlet-name': 'cofaxCDS',
  'versions': [1, 4, 5, 6],
  'servlet-class': 'org.cofax.cds.CDSServlet',
  'init-param': {
    'useJSP': false,
    'jspListTemplate': 'listTemplate.jsp',
    'jspFileTemplate': 'articleTemplate.jsp',
    'cachePackageTagsTrack': 200,
    'cachePackageTagsStore': 200,
    'cachePackageTagsRefresh': 60,
    'cacheTemplatesTrack': 100,
    'cacheTemplatesStore': 50,
    'cacheTemplatesRefresh': 15,
    'cachePagesTrack': 200,
    'cachePagesStore': 100,
    'cachePagesRefresh': 10,
    'cachePagesDirtyRead': 10,
    'searchEngineListTemplate': 'forSearchEnginesList.htm',
    'searchEngineFileTemplate': 'forSearchEngines.htm',
    'searchEngineRobotsDb': 'WEB-INF/robots.db',
    'maxUrlLength': 500,
    'now': new Date()
  }
}
