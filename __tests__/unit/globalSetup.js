// Runs once before the unit tests. Worker processes inherit this env var,
// so every Date in the tests is interpreted in UTC regardless of the
// developer's or CI runner's local time zone.
module.exports = async () => {
  process.env.TZ = "UTC";
};
