Create certificates similar to the instructions in:
https://letsencrypt.org/docs/certificates-for-localhost/

```
openssl req -x509 -out bedrock.localhost.crt -keyout bedrock.localhost.key \
  -newkey rsa:2048 -nodes -sha256 -days 10000 \
  -subj '/CN=bedrock.localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=bedrock.localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:bedrock.localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```
