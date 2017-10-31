# Utils


### okapiLanguagesToSelect2Js.xslt

This `xslt` file is used to create a new XML file 
based on the [`languages.xml`](https://bitbucket.org/okapiframework/okapi/src/master/applications/rainbow/src/main/resources/shared/languages.xml) 
file from [Okapi](https://bitbucket.org/okapiframework/okapi).
    
The input `languages.xml` file looks like:

```xml
<?xml version="1.0" encoding="utf-8"?>
<okapiLanguages version="1">
 <language code='ab' lcid='-1' encoding='windows-1251' macEncoding='UTF-8' unixEncoding='UTF-8'>
  <name>Abkhazian</name>
 </language>
 <language code='ab-GE' lcid='-1' encoding='windows-1251' macEncoding='UTF-8' unixEncoding='UTF-8' flag='flagABK'>
  <name>Abkhazian (*Georgia)</name>
 </language>
 <language code='om' lcid='-1' encoding='windows-1252' macEncoding='UTF-8' unixEncoding='UTF-8'>
  <name>Afaan Oromo</name>
 </language>
 <language code='om-ET' lcid='-1' encoding='windows-1252' macEncoding='UTF-8' unixEncoding='UTF-8' flag='flagET'>
  <name>Afaan Oromo (*Ethiopia)</name>
 </language>
```

And the transformed file looks like:

```xml
<languages version="1">
  <language id="ab" slug="ab" text="Abkhazian"/>
  <language id="ab-GE" slug="ab-GE" text="Abkhazian (*Georgia)"/>
  <language id="om" slug="om" text="Afaan Oromo"/>
  <language id="om-ET" slug="om-ET" text="Afaan Oromo (*Ethiopia)"/>
```

Which can easily be converted to:

```json
[
  {
    "id": "ab",
    "slug": "ab",
    "text": "Abkhazian"
  },
  {
    "id": "ab-GE",
    "slug": "ab-GE",
    "text": "Abkhazian (*Georgia)"
  },
  {
    "id": "om",
    "slug": "om",
    "text": "Afaan Oromo"
  },
  {
    "id": "om-ET",
    "slug": "om-ET",
    "text": "Afaan Oromo (*Ethiopia)"
  },
```

A format that's ready to go with [Select2](https://select2.org).

The converted `JSON` file should be placed in `public/languages.json`