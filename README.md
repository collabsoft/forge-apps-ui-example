[![Atlassian license](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](LICENSE)
## Issue Adjustments Forge Example

This repository is for the early access preview for the upcoming [Issue Adjustments extension point](https://trello.com/c/HohZrqJl/77-issue-adjustments).

This app serves as an end-to-end example of how to use issue adjustments in Jira Cloud.
It's a Forge app that provides three issue adjustments operations:

- Hiding the priority field
- Changing the summary field label to "Adjusted summary label"
- Changing the assignee field description to "Description added by issue adjustments"

Also, it provides a basic example of how to retrieve the app context and how to call product API.

## About Forge

See [Atlassian Developer Forge space](https://developer.atlassian.com/platform/forge) for documentation and tutorials explaining Forge, including the [documentation of Forge custom fields](https://developer.atlassian.com/platform/forge/manifest-reference/#jira-custom-field).

## Requirements

- See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

- Jira instance prerequisites:
  - The [issue create view experience](https://support.atlassian.com/jira-work-management/docs/what-is-the-new-jira-issue-create-experience/) enabled.
  - Issue adjustments integration code enabled. This feature can only be enabled by Atlassian.


## Quick start

- Install dependencies by `npm install`
```
npm install
```

- Build your Issue Adjustments resource in `static/issue-adjustments` by `npm install && npm run build`
```
(cd static/issue-adjustments && npm install && npm run build)
```
- Build your Admin Page resource in `static/admin-page` by `npm install && npm run build`
```
(cd static/admin-page && npm install && npm run build)
```

- Register your app by running:
```
forge register
```

- Build and deploy your app by running:
```
forge deploy --no-verify
```

- Install your app in an Atlassian site by running:
```
forge install
```

- Modify your Issue Adjustments resource by editing files in `static/issue-adjustments`. After modifying file, remember to build your app in `static/issue-adjustments` by `npm run build`.
```
(cd static/isue-adjustments && npm run build)
```
- Modify your Admin Page resource by editing files in `static/admin-page`. After modifying file, remember to build your app in `static/admin-page` by `npm run build`.
```
(cd static/admin-page && npm run build)
```

- Develop your app by running `forge tunnel` to proxy invocations locally:
```
forge tunnel
```

### Notes
- Use the `forge deploy --no-verify` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.
- Use the `forge install --upgrade` command when you changed permissions scope in `manifest.yml` to persist changes.

## Using the example

This example app will affect issue create dialog for configured project and issue types.

### Project type support
Currently, Issue Adjustments only supports company-managed software projects. Other project types, like Jira Service Management or team-managed projects, will not work with Issue Adjustments at this stage.

You can read more about the difference [here](https://support.atlassian.com/jira-software-cloud/docs/what-are-team-managed-and-company-managed-projects/).

## License

Copyright (c) 2022 Atlassian and others.
Apache 2.0 licensed, see [LICENSE](LICENSE) file.

[![From Atlassian](https://raw.githubusercontent.com/atlassian-internal/oss-assets/master/banner-cheers.png)](https://www.atlassian.com)
