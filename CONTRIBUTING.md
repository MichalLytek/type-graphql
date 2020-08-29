# Contributing to TypeGraphQL

We would love for you to contribute to TypeGraphQL and help make it even better than it is today!
As a contributor, here are the guidelines we would like you to follow:

- [Question or Problem?](#question)
- [Issues and Bugs](#issue)
- [Feature Requests](#feature)
- [Submission Guidelines](#submit)
- [Coding Rules](#rules)
- [Commit Message Guidelines](#commit)

## <a name="question"></a> Got a Question or Problem?

Do not open issues for general support questions as we want to keep GitHub issues for bug reports and feature requests.

Instead, consider using [Stack Overflow](https://stackoverflow.com/questions/tagged/typegraphql) to ask support-related questions. When creating a new question on Stack Overflow, make sure to add the `typegraphql` tag.

If you would like to chat about the question in real-time, you can reach out via [our gitter channel][gitter].

## <a name="issue"></a> Found a Bug?

If you find a bug in the source code, you can help us by [submitting an issue](#submit-issue) to our [GitHub Repository][github].
Even better, you can [submit a Pull Request](#submit-pr) with a failing test case that reproduces the issue.

## <a name="feature"></a> Missing a Feature?

You can _request_ a new feature by [submitting an issue](#submit-issue) to our GitHub Repository.

If you would like to _implement_ a new feature, please consider the size of the change in order to determine the right steps to proceed:

- For a **Major Feature**, first open an issue and outline your proposal so that it can be discussed.
  This process allows us to better coordinate our efforts, prevent duplication of work, and help you to craft the change so that it is successfully accepted into the project.

- **Small Features** can be crafted and directly [submitted as a Pull Request](#submit-pr).

## <a name="submit"></a> Submission Guidelines

### <a name="submit-issue"></a> Submitting an Issue

Before you submit an issue, please search the issue tracker. An issue for your problem may already exist and the discussion might inform you of workarounds readily available.

You can file new issues by selecting from our [new issue templates](https://github.com/MichalLytek/type-graphql/issues/new/choose) and filling out the issue template.

### <a name="submit-pr"></a> Submitting a Pull Request (PR)

Before you submit your Pull Request (PR) consider the following guidelines:

1. Search [GitHub](https://github.com/MichalLytek/type-graphql/pulls) for an open or closed PR that relates to your submission.
   You don't want to duplicate existing efforts.

2. Be sure that an issue describes the problem you're fixing, or documents the design for the feature you'd like to add.
   Discussing the design upfront helps to ensure that we're ready to accept your work.

3. Fork this repo.

4. Make your changes in a new git branch:

   ```shell
   git checkout -b my-fix-branch master
   ```

5. Create your patch, **including appropriate test cases**.

6. Follow our [Coding Rules](#rules).

7. Run the full test suite, and ensure that all tests pass.

8. Commit your changes using a descriptive commit message that follows our [commit message guidelines](#commit).
   Adherence to these conventions is necessary because release notes are automatically generated from these messages.

   ```shell
   git commit -a
   ```

   Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

9. Push your branch to GitHub:

   ```shell
   git push origin my-fix-branch
   ```

10. In GitHub, send a pull request to `type-graphql:master`.
Make sure to [allow edits from maintainers][allow-maintainer-edits].

If we ask for changes via code reviews then:

- Make the required updates.
- Re-run the test suites to ensure tests are still passing.
- Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

  ```shell
  git rebase master -i
  git push -f
  ```

That's it! Thank you for your contribution!

#### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes from the main (upstream) repository:

- Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

  ```shell
  git push origin --delete my-fix-branch
  ```

- Check out the master branch:

  ```shell
  git checkout master -f
  ```

- Delete the local branch:

  ```shell
  git branch -D my-fix-branch
  ```

- Update your master with the latest upstream version:

  ```shell
  git pull --ff upstream master
  ```

## <a name="rules"></a> Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as you are working:

- All features or bug fixes **must be covered by tests**.

- The code must pass type checking and fullfil all the TSLint rules.

## <a name="commit"></a> Commit Message Guidelines

For more information checkout this [commit rules guide](https://www.conventionalcommits.org/en/v1.0.0/).

[github]: https://github.com/MichalLytek/type-graphql
[gitter]: https://gitter.im/type-graphql/Lobby
[stackoverflow]: https://stackoverflow.com/questions/tagged/typegraphql
[allow-maintainer-edits]: https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/allowing-changes-to-a-pull-request-branch-created-from-a-fork#enabling-repository-maintainer-permissions-on-existing-pull-requests
