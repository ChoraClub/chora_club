import user1 from '../../assets/images/notifications/user1.svg'
import user2 from '../../assets/images/notifications/user2.svg'
import user3 from '../../assets/images/notifications/user3.svg'
import user4 from '../../assets/images/notifications/user4.svg'
import { FaClock} from 'react-icons/fa';
import { IoCheckmarkCircle } from "react-icons/io5";
import { BsDatabaseFillCheck } from "react-icons/bs";
import { PiVideoFill } from "react-icons/pi";
import { FaUserCheck } from "react-icons/fa6";

export const dataNotification={
    "notifications":[
        {
            "day":"Today",
            "items":[
                {
                    "flag":1,
                    "image":user1,
                    "title":"User 0x3JDFK…DSF has scheduled a session with you on Optimism",
                    "time":"on November 2, 2024 at 5:00 PM",
                    "timeAgo":"2 hours ago",
                    "icon":FaClock,
                    "color":"#FFD3DE",
                    "iconColor":"#FF8A00"
                },
                {
                    "flag":2,
                    "image":user2,
                    "title":"Your session with user 0x8EDH…SDF is confirmed on Arbitrum",
                    "time":"at 3:00 PM today.",
                    "timeAgo":"1 hours ago",
                    "icon":IoCheckmarkCircle,
                    "color":"#FFD4CF",
                    "iconColor":"#00C259"
                }
            ]
        },
        {
            "day":"Yesterday",
            "items":[
                {
                    "flag":3,
                    "image":user3,
                    "title":"The session you attended with user 0x3JDFK…DSF is now uploaded in the recordings section",
                    "time":"on November 2, 2024 at 5:00 PM",
                    "timeAgo":"",
                    "icon":PiVideoFill,
                    "color":"#FFD3F8",
                    "iconColor":"#9747FF"
                },
                {
                    "flag":4,
                    "image":user4,
                    "title":"0x8EDH…SDF is now following you",
                    "time":"on November 2, 2024 at 5:00 PM",
                    "timeAgo":"",
                    "icon":FaUserCheck,
                    "color":"#FFDCDA",
                    "iconColor":"#0057FF"
                },
                {
                    "flag":5,
                    "image":user2,
                    "title":"You've received an off-chain attestation for a session with user 0x2jd…efs. Claim your on-chain attestation now",
                    "time":"on November 2, 2024 at 5:00 PM",
                    "timeAgo":"",
                    "icon":BsDatabaseFillCheck,
                    "color":"#FFD4CF",
                    "iconColor":"#9747FF"
                },

            ]
        }
    ]
}