/*!
 * Copyright (c) 2016-2024 Digital Bazaar, Inc.
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as bedrock from '@bedrock/core';
import '@bedrock/server';
import '@bedrock/test';

bedrock.start().catch(e => {
  console.error(e);
  process.exit(1);
});
