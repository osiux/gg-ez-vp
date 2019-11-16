import { PLAYBACK_PROGRESS, TIMESTAMP } from '../../constants';
import secondsToReadableTime from '../../helpers/secondsToReadableTime';
import createNode from '../../helpers/createNode';

export default function timestamp(container) {
    const currentTime = this.getCurrentTime();
    const initialDuration = this.getDuration();
    const fancyCurrentTime = secondsToReadableTime(currentTime);
    const fancyDuration = secondsToReadableTime(initialDuration);

    const classNameRoot = this.__getCSSClass(TIMESTAMP);
    const timestampNode = createNode('div', classNameRoot);

    const [timestampCurrent, , timestampDuration] = [
        ['current', fancyCurrentTime],
        ['break', '/'],
        ['total', fancyDuration]
    ].map(([name, content]) => {
        const node = createNode('div', `${classNameRoot}-${name}`);
        node.innerText = content;
        timestampNode.appendChild(node);
        return node;
    });

    // Set duration once playback starts if it wasn't available
    this.once('loadedmetadata', () => {
        const duration = this.getDuration();
        const fancyDuration = secondsToReadableTime(duration);
        if (!initialDuration) {
            timestampDuration.innerText = fancyDuration;
        }
    });

    //TODO: Throttle DOM updates when fancyCurrentTime is the same
    // Update currentTime
    this.on(PLAYBACK_PROGRESS, ({ fancyCurrentTime }) => {
        timestampCurrent.innerText = fancyCurrentTime;
    });

    container.appendChild(timestampNode);
}
