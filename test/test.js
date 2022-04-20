/*!
 * Copyright (c) 2016-2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as bedrock from '@bedrock/core';
import '@bedrock/server';
import '@bedrock/test';

bedrock.start().catch(e => {
  console.error(e);
  process.exit(1);
});
