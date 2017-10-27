<!--
  Converts an okapiLanguages object to a format suitable for Select2Js selectors,
  The output can easily be converted to JSON, and placed in public/languages.json
-->
<xsl:stylesheet version="2.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml"
              encoding="utf-8"
              indent="yes" />
  <xsl:strip-space elements="*" />
  <xsl:template match="/">
    <xsl:element name="languages">
      <xsl:attribute name="version">
        <xsl:value-of select="/okapiLanguages/@version" />
      </xsl:attribute>
      <xsl:for-each select="//okapiLanguages/language">
        <xsl:element name="language">
          <xsl:attribute name="id">
            <xsl:value-of select="@code" />
          </xsl:attribute>
          <xsl:attribute name="slug">
            <xsl:value-of select="@code" />
          </xsl:attribute>
          <xsl:attribute name="text">
            <xsl:value-of select="name" />
          </xsl:attribute>
        </xsl:element>
      </xsl:for-each>
    </xsl:element>
  </xsl:template>

</xsl:stylesheet>
