import { CharacterFactory } from "./characterfactory";

export class SessionManager {

    // Character (parent class of both Player, Enemy, and NPC alike)
    // Item
    // Stage (or “map”, which manages the NPCs, Enemies, and Items in its game area)
    // Game (which, of course, stores all of the above)
    public serialize(savePosition): string {
        if (savePosition === undefined) savePosition = true;
        var fields = [
            'speech',
            'battle',
            'health',
            'motion',
            'target',
            'quests',
            'items',
            'options',
            'log'
        ];

        if (savePosition) {
            fields.push('x');
            fields.push('y');
        }

        var obj = {};

        for (var i in fields) {
            var field = fields[i];
            obj[field] = this[field];
        }

        return JSON.stringify(obj);
    };

    /**
     * This is a class method, not an instance method!
     *
     * @param state string | object the state to unserialize into a character
     *
     * @return Character instance, class depending on the state restored
     */
    unserialize(state): any {
        //todo
        const game = null;  


        // We should be able to accept an object or a string.
        if (typeof state === 'string') {
            state = JSON.parse(state);
        }

        // Default class name
        var className = 'Character';

        // Class name can be specified in the serialized data.
        if (state.options.className) {
            className = state.options.className;
        }

        // Call our character factory to make a new instance of className
        var instance = CharacterFactory.newCharacter(
            className,
            game, // Game reference. Required
            0, // x-pos. Required, but overridden by unserialize
            0// y-pos. Required, but overridden by unserialize
            // {} // options. Required, but overridden by unserialize
        );

        // Copy our saved state into the new object
        for (var i in state) {
            instance[i] = state[i];
        }

        return instance;
    };


    /**
 * Save the game state.
 *
 * If no key is given, will save as "save-default"
 * If a key is give, will prepend with "save-"
 */
    public save(key) {
        if (key === undefined) key = 'default';
        localStorage.setItem('save-' + key, this.serialize(true));
    };

    /**
     * Load a game state.
     *
     * If no key is given, will load "save-default"
     * If a key is give, will prepend with "save-"
     */
    public load(key) {
        if (key === undefined) key = 'default';
        var state = localStorage.getItem('save-' + key);
        if (state) {
            this.unserialize(state);
        }
    };
}