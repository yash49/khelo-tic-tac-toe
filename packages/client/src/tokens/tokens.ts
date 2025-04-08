import { tokens as colorTokens } from '../../.unicornix/theme.refs';
import { spaceTokens, radiusTokens } from './sizes';

const tokens = {
  color: colorTokens,
  space: spaceTokens,
  radius: radiusTokens,
} as const;

export { tokens };
