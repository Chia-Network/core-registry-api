# Core Registry API

![Minimum Chia Version](https://raw.githubusercontent.com/Chia-Network/core-registry-api/main/minimumChiaVersion.svg)
![Tested Up to Chia Version](https://raw.githubusercontent.com/Chia-Network/core-registry-api/main/testedChiaVersion.svg)

​This project provides a unified interface for the [Chia Blockchain](https://github.com/Chia-Network/chia-blockchain) carbon Core Registry applications.  These applications include:

* [Chia Blockchain](https://github.com/Chia-Network/chia-blockchain)
* [Climate Explorer](https://github.com/Chia-Network/climate-token-driver)
* [Chia Climate Tokenization](https://github.com/Chia-Network/climate-token-driver)
* [Core Registry Climate Action Data Trust](https://github.com/Chia-Network/core-registry-cadt)

This API application is meant to run 24-7.  Users of the Core Registry API will likely also want to run a [Climate Wallet](https://github.com/Chia-Network/Climate-Wallet) on a desktop computer or laptop.  For a user interface, use the [Core Registry UI](https://github.com/Chia-Network/core-registry-ui) application, either in a web browser or locally.

The simplest way to run the Core Registry API application is to run on the same machine as a Chia Full Node, Chia Wallet, Datalayer, and Datalayer HTTP services.  Core Registry API communicates with the Chia services over an RPC interface.  The RPC interface uses certificates to authenticate, which will work automatically when the Core Registry API application is run as the same user on the same machine as the Chia services.  To run Core Registry API on a separate machine from Chia, a public certificate from the Chia node most be used to authenticate (not yet documented).

## Installation

[Releases are tagged in Github](https://github.com/Chia-Network/core-registry-api/releases) and binaries are built for Windows, MacOS, and Linux.  ARM binaries are available for Debian versions of Linux only.

### Linux

A binary executable file that can run on all Linux distributions on x86 or arm64 hardware can be found for each tagged release.

#### Debian-based Linux Distros (Ubuntu, Mint, etc)

The Core Registry API can be installed with `apt`.  Both ARM and x86 versions can be installed this way.

1. Start by updating apt and allowing repository download over HTTPS:

```
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
```

2.  Add Chia's official GPG Key (if you have installed Chia with `apt`, you'll have this key already and will get a message about overwriting the existing key, which is safe to do):

```
curl -sL https://repo.chia.net/FD39E6D3.pubkey.asc | sudo gpg --dearmor -o /usr/share/keyrings/chia.gpg
```

3. Use the following command to setup the repository.

```
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/chia.gpg] https://repo.chia.net/climate-tokenization/debian/ stable main" | sudo tee /etc/apt/sources.list.d/climate-tokenization.list > /dev/null

```

4.  Install Core Registry API

```
sudo apt-get update
sudo apt-get install core-registry-api
```

5.  Start Core Registry API with systemd

```
sudo systemctl start core-registry-api@<USERNAME>
```
For `<USERNAME>`, enter the user that Chia runs as (the user with the `.chia` directory in their home directory).  For example, if the `ubuntu` is where Chia runs, start Core Registry API with `systemctl start core-registry-api@ubuntu`.

6.  Set Core Registry API to run at boot

```
sudo systemctl enable core-registry-api@<USERNAME>
```

#### Pre-release Versions

Experimental code is released with a "release candidate" naming convention and can be found on the [releases](/releases) page with `-rc` in the version number. Not all of the release candidates will be stable and caution should be used.

Release candidates can be installed via `apt` using the instructions (above)[#debian-based-linux-distros-ubuntu-mint-etc] except replace step 3 with the following:

```
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/chia.gpg] https://repo.chia.net/climate-tokenization-test/debian/ stable main" | sudo tee /etc/apt/sources.list.d/climate-tokenization-test.list > /dev/null
```

If both the stable and release-candidate repos are added, `apt` can switch between versions installed using by appending `=<version-number>` to the install command:

```
apt install core-registry-api=1.0.39
apt install core-registry-api=1.0.39-rc3
apt install core-registry-api=1.0.1
```

Without specifying the version number, `apt` will install the latest release candidate if it exists, which might not always be desired.

## Ports, Networking, and Security

To configure the services in the unified Core Registry API, please see the documentation of the individual applications listed at the top of this README.

## Tools

### update-ip.sh

The [`update-ip.sh`](tools/update-ip.sh) script in the `tools` directory helps manage the `DATALAYER_FILE_SERVER_URL` configuration when your server's IP address changes. This is particularly useful for servers with dynamic IP addresses. Note that this script must be run as root (using sudo).

```bash
sudo ./tools/update-ip.sh --chia-user=<username> [--port=<port>] [--https] [--dry-run]
```

- `--chia-user=<username>`: (Required) The username of the Chia user whose configuration will be updated
- `--dry-run`: (Optional) Run in dry-run mode to see what changes would be made without actually making them
- `--port=<port>`: (Optional) Specify a custom port for the DATALAYER_FILE_SERVER_URL. If not provided, the script will use the port from your Chia config file.
- `--https`: (Optional) Use HTTPS instead of HTTP for the DATALAYER_FILE_SERVER_URL. If not provided, HTTP will be used.

This script does the following:

1. Fetches your current public IP address
2. Updates the `DATALAYER_FILE_SERVER_URL` in your Core Registry CADT config file
3. Deletes all mirrors using `chia-tools data delete-mirrors --all`
4. Restarts the Core Registry CADT service

## Contributing

All branches should be created from the `develop` branch and not from `main`.  All pull requests should be made against the `develop` branch, unless it is a new release.  The `develop` branch will be merged into the `main` branch to create a release.  Automation in the CI will create the [release](https://github.com/Chia-Network/core-registry-api/releases) and attach the installation files to it automatically whenever code is merged to `main`.  Additionally, the changelog will automatically be updated in the `main` branch.  Therefore, the `main` branch should always be a representation of the latest released code.

​This repo uses a [commit convention](https://www.conventionalcommits.org/en/v1.0.0/). A typical commit message might read:
​
```
    fix: correct home screen layout
```
​
The first part of this is the commit "type". The most common types are "feat" for new features, and "fix" for bugfixes. Using these commit types helps us correctly manage our version numbers and changelogs. Since our release process calculates new version numbers from our commits it is very important to get this right.
​

- `feat` is for introducing a new feature
- `fix` is for bug fixes
- `docs` for documentation only changes
- `style` is for code formatting only
- `refactor` is for changes to code which should not be detectable by users or testers
- `perf` is for a code change that improves performance
- `test` is for changes which only touch test files or related tooling
- `build` is for changes which only touch our develop/release tools
- `ci` is for changes to the continuous integration files and scripts
- `chore` is for changes that don't modify code, like a version bump
- `revert` is for reverting a previous commit
  ​
  After the type and scope there should be a colon.
  ​
  The "subject" of the commit follows. It should be a short indication of the change. The commit convention prefers that this is written in the present-imperative tense.

## Versioning

This project mostly adheres to semantic versioning.  The version specified in `package.json` will be used by the ci to create the new release in Github so it is important to set that correctly.  The major version (version 1.0, 2.0, etc) should only be changed when the data model changes and the API goes from v1 to v2.  Minor version changes (version 1.2 to 1.3, etc) are for breaking or substantial changes, usually requiring some action on the user's part.

The version of Chia that Core Registry has been tested up to is controlled in package.json by the `chiaVersion` field, which automatically will build into a badge when the CI runs.

## Attribution

* [Document Object Model](https://www.w3.org/TR/DOM-Requirements/) by [W3C](https://www.w3.org/) licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)
* [caniuselite](https://github.com/browserslist/caniuse-lite) by [Browserlist](https://browsersl.ist/) licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)
