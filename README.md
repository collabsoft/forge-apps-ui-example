[![Atlassian license](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](LICENSE)

## UI modifications forge example

This repository is for the early access preview for the upcoming
[UI modifications extension point](https://trello.com/c/HohZrqJl/77-issue-adjustments).

This app serves as an end-to-end example of how to write and use UI modifications in Jira Cloud. 

This Forge app provides the following UI modifications operations:

- Hiding the priority field
- Changing the summary field label to "Modified summary label"
- Changing the assignee field description to "Description added by UI modifications"
- Listening for `summary` field change and
  - modifying description of `summary` field with the latest date time
  - showing the priority field

Also, it provides an example admin page to control the UI modifications and where you can understand how to retrieve the app context and how to call product API.

## About Forge

See [Atlassian Developer Forge space](https://developer.atlassian.com/platform/forge) for
documentation and tutorials explaining Forge, including the
[documentation of Forge custom fields](https://developer.atlassian.com/platform/forge/manifest-reference/#jira-custom-field).

## Requirements

-   See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for
    instructions to get set up.

-   Jira instance prerequisites:
    -   The
        [issue create view experience](https://support.atlassian.com/jira-work-management/docs/what-is-the-new-jira-issue-create-experience/)
        enabled.
    -   UI modifications integration code enabled. This feature can only be enabled by Atlassian.

## Quick start

-   Install dependencies by `yarn install`

```
yarn install
```

- Build both the UI modifications `static/ui-modifications` and admin panel `static/admin-page` modules:

```
yarn build
```

- Or watch changes when you're making modifications:

```
yarn watch
```

- You can also define specific modules if you're not changing both at the same time

```
yarn build:uim
yarn build:admin
```

```
yarn watch:uim
yarn watch:admin
```

-   Register your app by running:

```
forge register
```

-   Build and deploy your app by running:

```
forge deploy
```

-   Install your app in an Atlassian site by running:

```
forge install
```

-   Develop your app by running `forge tunnel` to proxy invocations locally:

```
forge tunnel
```

### Notes

-   Use the `forge deploy` command when you want to persist code changes.
-   Use the `forge install` command when you want to install the app on a new site.
-   Once the app is installed on a site, the site picks up the new app changes you deploy without
    needing to rerun the install command.
-   Use the `forge install --upgrade` command when you changed permissions scope in `manifest.yml`
    to persist changes.

## Using the example

This example app will affect issue create dialog for configured project and issue types.

### Project type support

Currently, UI modifications only supports company-managed and team-managed Jira Software projects. Other project types
like Jira Service Management will not work with UI modifications at this stage.

## License

Copyright (c) 2022 Atlassian and others. Apache 2.0 licensed, see [LICENSE](LICENSE) file.

[![From Atlassian](https://raw.githubusercontent.com/atlassian-internal/oss-assets/master/banner-cheers.png)](https://www.atlassian.com)
