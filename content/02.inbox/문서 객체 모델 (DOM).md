---
title: 문서 객체 모델 (DOM)
resource-path: 02.inbox/문서 객체 모델 (DOM).md
keywords:
tags:
  - javascript
  - language
date: 2023-12-20T07:12:00+09:00
lastmod: 2023-12-20T07:12:00+09:00
---
___

The HTML DOM document object is the owner of all other objects in your web page.

___


The document object represents your web page.

If you want to access any element in an HTML page, you always start with accessing the document object.

Below are some examples of how you can use the document object to access and manipulate HTML.

___


| Method | Description |
| --- | --- |
| document.getElementById(_id_) | Find an element by element id |
| document.getElementsByTagName(_name_) | Find elements by tag name |
| document.getElementsByClassName(_name_) | Find elements by class name |

___


| Property | Description |
| --- | --- |
| _element_.innerHTML =  _new html content_ | Change the inner HTML of an element |
| _element_._attribute = new value_ | Change the attribute value of an HTML element |
| _element_.style._property = new style_ | Change the style of an HTML element |
| Method | Description |
| _element_.setAttribute_(attribute, value)_ | Change the attribute value of an HTML element |

___


| Method | Description |
| --- | --- |
| document.createElement(_element_) | Create an HTML element |
| document.removeChild(_element_) | Remove an HTML element |
| document.appendChild(_element_) | Add an HTML element |
| document.replaceChild(_new, old_) | Replace an HTML element |
| document.write(_text_) | Write into the HTML output stream |

___


| Method | Description |
| --- | --- |
| document.getElementById(_id_).onclick = function(){_code_} | Adding event handler code to an onclick event |

___


The first HTML DOM Level 1 (1998), defined 11 HTML objects, object collections, and properties. These are still valid in HTML5.

Later, in HTML DOM Level 3, more objects, collections, and properties were added.

| Property | Description | DOM |
| ---- | ---- | ---- |
| document.anchors | Returns all \<a> elements that have a name attribute | 1 |
| document.applets | Deprecated | 1 |
| document.baseURI | Returns the absolute base URI of the document | 3 |
| document.body | Returns the \<body> element | 1 |
| document.cookie | Returns the document's cookie | 1 |
| document.doctype | Returns the document's doctype | 3 |
| document.documentElement | Returns the \<html> element | 3 |
| document.documentMode | Returns the mode used by the browser | 3 |
| document.documentURI | Returns the URI of the document | 3 |
| document.domain | Returns the domain name of the document server | 1 |
| document.domConfig | Obsolete. | 3 |
| document.embeds | Returns all \<embed> elements | 3 |
| document.forms | Returns all \<form> elements | 1 |
| document.head | Returns the \<head> element | 3 |
| document.images | Returns all \<img> elements | 1 |
| document.implementation | Returns the DOM implementation | 3 |
| document.inputEncoding | Returns the document's encoding (character set) | 3 |
| document.lastModified | Returns the date and time the document was updated | 3 |
| document.links | "Returns all \<area> and \<a> elements that have a href attribute" | 1 |
| document.readyState | Returns the (loading) status of the document | 3 |
| document.referrer | Returns the URI of the referrer (the linking document) | 1 |
| document.scripts | Returns all \<script> elements | 3 |
| document.strictErrorChecking | Returns if error checking is enforced | 3 |
| document.title | Returns the \<title> element | 1 |
| document.URL | Returns the complete URL of the document | 1 |

  