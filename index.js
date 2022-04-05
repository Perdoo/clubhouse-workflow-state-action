const core = require("@actions/core");
const { ShortcutClient } = require("@useshortcut/client");

async function run() {
  try {
    const shortcutToken = core.getInput("shortcutToken");
    const shortcutClient = new ShortcutClient(shortcutToken);
    const fromStateId = core.getInput("fromStateId");
    const toStateId = core.getInput("toStateId");

    core.setSecret("shortcutToken");

    const storyIds = await getStoryIds(shortcutClient, fromStateId);

    if (storyIds.length) {
      await moveStories(shortcutClient, storyIds, toStateId);
      core.info(`Moved ${storyIds.length} stories.`);
    } else {
      core.info("No stories found in the given workflow state.");
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function getStoryIds(shortcutClient, fromStateId) {
  let storyIds = [];

  const callback = async (result) => {
    const data = result.data;

    if (!data.total) {
      return;
    }

    for ({ id } of data.data) {
      storyIds.push(id);
    }

    if (!data.next) {
      return;
    }

    return fetchNextSearchStories(shortcutClient, data.next, callback);
  };

  await shortcutClient
    .searchStories({ query: `state:${fromStateId}` })
    .then(callback);

  return storyIds;
}

async function fetchNextSearchStories(shortcutClient, next, callback) {
  if (!next) {
    return;
  }

  return await shortcutClient
    .request({
      path: next,
      method: "GET",
      secure: true,
      format: "json",
    })
    .then(callback);
}

async function moveStories(shortcutClient, storyIds, toStateId) {
  await shortcutClient.updateMultipleStories({
    story_ids: storyIds,
    workflow_state_id: toStateId,
  });
}

run();
