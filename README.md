## Description
Chrome extension for quick filling issue comment in Jira (e.g. specify environment, build, resolution, etc based on predefined template)

## Important notes
1. As Jira uses WYSIWYG editor (that is hard to manipulate with because of iframe) it was decided to work with the text mode as muck simpler. Text mode is actually `textarea` tag with markdown support, so main flow is Switch to Text mode -> Set generated text in markdown format to texrarea -> switch back to Visual mode.
1. You may notice that after adding text "Add" button is still inactive. You just need to type any character (it's assumed that anyway you're going to provide some additional data), so shouldn't be a problem. Technical reason is that button is enabling after some javascript events (keypress, onchange or similar) that for now are not implemented in the plugin.
1. When creating own template pay attention that markdown can ignore empty lines (including line with spaces only). In some cases using non-breaking space `&nbsp;` can help.

## Useful links
1. [ALM Jira demo](https://jira.demo.almworks.com/) demo/demo
1. [Testflo Jira demo](http://demo.testflo.com/) testflo/testflo
1. [Chrome extensions development docs](https://developer.chrome.com/docs/extensions/mv3/)