import { test, expect } from '../../src/fixtures/index';
import { setFeature, setStory, step } from '../../src/utils/allure-helpers';

test.describe('__FeatureName__', () => {
  test('@smoke __HappyPathDescription__', async ({ /* inject page fixture */ }) => {
    await setFeature('__FeatureName__');
    await setStory('__StoryName__');

    await step('Navigate to page', () => { /* page.goto() */ });
    await step('Perform action', () => { /* action */ });
    await step('Assert result', () => { /* assertion */ });
  });

  test('@regression __EdgeCaseDescription__', async ({ /* inject page fixture */ }) => {
    await setFeature('__FeatureName__');
    await setStory('__EdgeCaseName__');

    await step('Navigate to page', () => { /* page.goto() */ });
    await step('Perform invalid action', () => { /* action */ });
    await step('Assert error state', () => { /* assertion */ });
  });
});
