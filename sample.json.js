/* http://json.org/example.html */

module.exports = {
  'web-app': {
    'servlet': [
      {
        'servlet-name': 'cofaxCDS',
        'versions': [1, 4, 5, 6],
        'servlet-class': 'org.cofax.cds.CDSServlet',
        'init-param': {
          'configGlossary:installationAt': 'Philadelphia, PA',
          'configGlossary:adminEmail': 'ksm@pobox.com',
          'configGlossary:poweredBy': 'Cofax',
          'configGlossary:poweredByIcon': '/images/cofax.gif',
          'configGlossary:staticPath': '/content/static',
          'templateProcessorClass': 'org.cofax.WysiwygTemplate',
          'templateLoaderClass': 'org.cofax.FilesTemplateLoader',
          'templatePath': 'templates',
          'templateOverridePath': '',
          'defaultListTemplate': 'listTemplate.htm',
          'defaultFileTemplate': 'articleTemplate.htm',
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
          'useDataStore': true,
          'dataStoreClass': 'org.cofax.SqlDataStore',
          'redirectionClass': 'org.cofax.SqlRedirection',
          'dataStoreName': 'cofax',
          'dataStoreDriver': 'com.microsoft.jdbc.sqlserver.SQLServerDriver',
          'dataStoreUrl': 'jdbc:microsoft:sqlserver://LOCALHOST:1433;DatabaseName=goon',
          'dataStoreUser': 'sa',
          'dataStorePassword': 'dataStoreTestQuery',
          'dataStoreTestQuery': "SET NOCOUNT ON;select test='test';",
          'dataStoreLogFile': '/usr/local/tomcat/logs/datastore.log',
          'dataStoreInitConns': 10,
          'dataStoreMaxConns': 100,
          'dataStoreConnUsageLimit': 100,
          'dataStoreLogLevel': 'debug',
          'maxUrlLength': 500}},
      {
        'servlet-name': 'cofaxEmail',
        'servlet-class': 'org.cofax.cds.EmailServlet',
        'init-param': {
          'mailHost': 'mail1',
          'mailHostOverride': 'mail2'}},
      {
        'servlet-name': 'cofaxAdmin',
        'servlet-class': 'org.cofax.cds.AdminServlet'},

      {
        'servlet-name': 'fileServlet',
        'servlet-class': 'org.cofax.cds.FileServlet'},
      {
        'servlet-name': 'cofaxTools',
        'servlet-class': 'org.cofax.cms.CofaxToolsServlet',
        'init-param': {
          'templatePath': 'toolstemplates/',
          'log': 1,
          'logLocation': '/usr/local/tomcat/logs/CofaxTools.log',
          'logMaxSize': '',
          'dataLog': 1,
          'dataLogLocation': '/usr/local/tomcat/logs/dataLog.log',
          'dataLogMaxSize': '',
          'removePageCache': '/content/admin/remove?cache=pages&id=',
          'removeTemplateCache': '/content/admin/remove?cache=templates&id=',
          'fileTransferFolder': '/usr/local/tomcat/webapps/content/fileTransferFolder',
          'lookInContext': 1,
          'adminGroupID': 4,
          'betaServer': true}}],
    'servlet-mapping': {
      'cofaxCDS': '/',
      'cofaxEmail': '/cofaxutil/aemail/*',
      'cofaxAdmin': '/admin/*',
      'fileServlet': '/static/*',
      'cofaxTools': '/tools/*'},

    'taglib': {
      'taglib-uri': 'cofax.tld',
      'taglib-location': '/WEB-INF/tlds/cofax.tld'
    }
  }
}