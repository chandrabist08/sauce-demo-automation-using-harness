module.exports = {
  async preToolUse({ tool, input }) {
    if (tool === 'Write' && typeof input.file_path === 'string') {
      if (input.file_path.includes('/tests/') && input.content?.includes("from '@playwright/test'")) {
        console.warn(
          '[hook] Warning: tests should import test/expect from src/fixtures/index, not @playwright/test'
        );
      }
    }
  },
};
