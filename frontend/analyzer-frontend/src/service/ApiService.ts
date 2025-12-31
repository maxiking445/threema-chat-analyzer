import { Configuration, DefaultApi } from "@/generated/api";
import { ModelsDayCount, ModelsGroupTimeline } from "@/generated/api/models";



const configuration = new Configuration({
    basePath: '/api',
});

const defaultApi = new DefaultApi(configuration);


export async function loadGroupTimeline(groupName: string ): Promise<ModelsGroupTimeline[]> {
    console.log("Loading timeline data for group:", groupName);

    try {
        const response = await defaultApi.groupsTimelineGet({ group: groupName });
        return response;
    } catch (err) {
        console.error("Error loading timeline:", err);
        return [];
    }
}