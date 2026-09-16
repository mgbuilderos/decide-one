# Security

Please report vulnerabilities privately through GitHub's **Report a vulnerability** button on the repository's Security tab. Do not open a public issue.

Most useful to hear about:

- anything that sends what a person writes off their device;
- weaknesses in `.vault` export encryption or its signature;
- ways to forge or bypass licence verification;
- problems in the Cloudflare Worker (`worker/`).

Out of scope: reading local storage on an unlocked device. Live entries are stored unencrypted by design, and the README says so.
