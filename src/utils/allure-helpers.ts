import { allure } from 'allure-playwright';

export async function step<T>(name: string, fn: () => Promise<T>): Promise<T> {
  return allure.step(name, fn);
}

export async function attachJson(name: string, data: unknown): Promise<void> {
  await allure.attachment(name, JSON.stringify(data, null, 2), {
    contentType: 'application/json',
  });
}

export async function attachText(name: string, text: string): Promise<void> {
  await allure.attachment(name, text, { contentType: 'text/plain' });
}

export function setFeature(feature: string): Promise<void> {
  return allure.feature(feature);
}

export function setStory(story: string): Promise<void> {
  return allure.story(story);
}
