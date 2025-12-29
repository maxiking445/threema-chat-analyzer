import { Configuration, DefaultApi } from "@/generated/api";
import { ModelsDayCount } from "@/generated/api/models";



const configuration = new Configuration({
    basePath: '/api',
});

const defaultApi = new DefaultApi(configuration);


export async function loadGroupTimeline(groupName: string, userID: string ): Promise<ModelsDayCount[]> {
    console.log("Loading timeline data for group:", groupName, "and user:", userID);

    try {
        const response = await defaultApi.groupsTimelineGet({ group: groupName });
        console.log("Timeline Data:", response);

        const filteredRes = response.filter(t => t.user === userID);
        if (filteredRes.length > 0) {
            console.log("Filtered Timeline Data:", filteredRes[0].timeline);
            return filteredRes[0].timeline;
        }
        return [];
    } catch (err) {
        console.error("Error loading timeline:", err);
        return [];
    }
}