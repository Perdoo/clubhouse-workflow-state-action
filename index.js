const core = require("@actions/core");
const { ShortcutClient } = require("@useshortcut/client");

async function run() {
  try {
    const shortcutToken = core.getInput("shortcutToken");
    const shortcutClient = new ShortcutClient(shortcutToken);
    const fromStateId = core.getInput("fromStateId");
    const toStateId = core.getInput("toStateId");

    core.setSecret("shortcutToken");

    const processResult = async (result) => {
      const data = result.data;

      if (!data.total) {
        core.info("No stories found in the given workflow state.");
        return;
      }

      for ({ id } of data.data) {
        shortcutClient.updateStory(id, { workflow_state_id: toStateId });
      }

      if (!data.next) {
        console.log(`Moved ${data.total} stories.`);
        return;
      }

      await shortcutClient
        .request({
          path: data.next,
          method: "GET",
          secure: true,
          format: "json",
        })
        .then(processResult);
    };

    shortcutClient
      .searchStories({ query: `state:${fromStateId}` })
      .then(processResult);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
