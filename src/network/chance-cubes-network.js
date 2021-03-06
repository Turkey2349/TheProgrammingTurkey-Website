import { getPostAuthParams } from './auth-network';
import { getGetParams } from './network';
import { getDevAPIBase } from './network-helper';

export async function getChanceCubesStats(start, end) {
    return await fetch(`${getDevAPIBase()}/chancecubes/stats?start=${start}&end=${end}`).then(resp => {
        if (resp.status == 200)
            return resp.json();
        return {};
    });
}

export async function getChanceCubesRewardStatus() {
    return await fetch(`${getDevAPIBase()}/chancecubes/rewardstatus`).then(resp => {
        if (resp.status == 200)
            return resp.json();
        return { rewards: [], notes: [] };
    });
}

export async function userListUpdateUser(uuid, name, type, twitch) {
    return await fetch(`${getDevAPIBase()}/chancecubes/userlistedit`, getPostAuthParams({ uuid, name, type, twitch })).then(resp => {
        return resp.json();
    });
}

export async function userListAddUser(uuid, name, type, twitch) {
    return await fetch(`${getDevAPIBase()}/chancecubes/userlistadd`, getPostAuthParams({ uuid, name, type, twitch })).then(resp => {
        return resp.json();
    });
}

export async function userListDeleteUser(uuid) {
    return await fetch(`${getDevAPIBase()}/chancecubes/userlistdelete`, getPostAuthParams({ uuid })).then(resp => {
        return resp.json();
    });
}

export async function getRewardSettings(rewardId) {
    return await fetch(`${getDevAPIBase()}/chancecubes/rewardsettings?rewardId=${rewardId}`, getGetParams()).then(resp => {
        return resp.json();
    });
}


export async function saveReward(rewardName, chance, isGiantCC, status) {
    return await fetch(`${getDevAPIBase()}/chancecubes/updatereward`, getPostAuthParams({
        name: rewardName,
        chance,
        is_giant_cube_reward: isGiantCC,
        status: status
    })).then(resp => {
        return resp.json();
    });
}

export async function createReward(rewardName, chance, isGiantCC) {
    return await fetch(`${getDevAPIBase()}/chancecubes/addreward`, getPostAuthParams({
        name: rewardName,
        chance,
        is_giant_cube_reward: isGiantCC
    })).then(resp => {
        return resp.json();
    });
}

