export function validateName(playerUsername: string): string {
  if (!playerUsername) return 'Required';
  if (/^([a-z]|[0-9]|_)*$/.test(playerUsername) === false)
    return 'Only lowercase letters, numbers and underscores are allowed';
  return '';
}
