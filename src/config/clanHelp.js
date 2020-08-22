const clanHelp = [
    [`info`, `View information about your clan`, null],
    [`create`, `Create a clan for $100,000`, [`name`]],

    [`promote`, `Promote a clan member to moderator`, [`user`]],
    [`demote`, `Demote a clan member from moderator`, [`user`]],

    [`invite`, `Invite a user to your clan`, [`user`]],
    [`kick`, `Kick a user from your clan`, [`user`]],

    [`leave`, `Leave your clan`, null],

    [`donate`, `Add money to your clan balance`, [`amount`]],
    // [`upgrades`, `Purchase upgrades for your clan.`, null],

    [`rename`, `Rename your clan for $50,000`, [`name`]],
    [`description`, `Change your clan's description`, [`description`]],
    [`image`, `Change your clan image for $50,000`, [`image_link`]],
    [`color`, `Change the color of your clan`, [`hexadecimal`]],
];

module.exports = { clanHelp }