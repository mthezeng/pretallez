def prompt_answer(upper):
    response = -1
    while not(response >= 0 and response <= upper):
        try:
            response = int(input('Choose the number of your option: '))
        except ValueError:
            print('Valid numbers are in parentheses above.')
    return response

def initial(call=''):
    if call:
        print('What was the next action?')
    else:
        print('What was the first action?')
    print('(0) Attack left         (1) Attack right')
    print('(2) Point-in-line left  (3) Point-in-line right')
    print('(4) Simultaneous attacks')
    print('(5) Yellow card left    (6) Yellow card right')
    print('(7) Red card left       (8) Red card right')
    option = prompt_answer(8)
    call += update_call_initial(option)
    if option < 2:
        call = attack_result(call, 'attack')
    elif option < 4:
        call = pol_result(call)
    elif option == 4:
        call += no_touch()
    elif option < 7:
        call += no_touch()
    elif option < 9:
        call += award_touch()
    return call

def update_call_initial(option):
    if option < 4:
        if option < 2:
            action_type = 'attack'
        elif option < 4:
            action_type = 'point-in-line'
        if option % 2 == 0:
            action = '{0} left '.format(action_type)
        else:
            action = '{0} right '.format(action_type)
    elif option == 4:
        action = 'simultaneous attacks, '
    elif option > 4:
        if option < 7:
            action_type = 'yellow card'
        elif option < 9:
            action_type = 'red card'
        if option % 2 == 0:
            action = '{0} right, '.format(action_type)
        else:
            action = '{0} left, '.format(action_type)
    return action

def attack_result(call, attack_type):
    print('What was the result of the {0}?'.format(attack_type))
    print('(0) {0} arrives'.format(attack_type))
    print('(1) {0} off target'.format(attack_type))
    print('(2) {0} misses'.format(attack_type))
    print('(3) {0} is parried, no riposte'.format(attack_type))
    print('(4) {0} is parried, riposte'.format(attack_type))
    option = prompt_answer(4)
    call += update_call_attack(option)
    if option == 0:
        call += award_touch()
    elif option == 1:
        call += no_touch()
    elif option == 2:
        call = defender_response(call)
    elif option == 3:
        call = attack_continuation(call)
    elif option == 4:
        call = attack_result(call, 'riposte')
    return call

def update_call_attack(option):
    actions = ['arrives, ', 'is off target, ', 'is no, ', 'is parried, no riposte, ',
                'is parried, riposte ']
    return actions[option]

def defender_response(call):
    print('Did the defender respond with a counterattack?')
    print('(0) Yes')
    print('(1) No')
    option = prompt_answer(1)
    call += update_call_defender(option)
    if option == 0:
        call = attack_result(call, 'counterattack')
    elif option == 1:
        call = attack_continuation(call)
    return call

def update_call_defender(option):
    actions = ['counterattack ', '']
    return actions[option]

def attack_continuation(call):
    print('Did the attacker continue their attack?')
    print('(0) Yes, remise.')
    print('(1) Yes, redoublement.')
    print('(2) No.')
    option = prompt_answer(2)
    call += update_call_continuation(option)
    if option == 0:
        call = attack_result(call, 'remise')
    elif option == 1:
        call = attack_result(call, 'redoublement')
    elif option == 2:
        call = initial(call)
    return call

def update_call_continuation(option):
    actions = ['rimise ', 'redoublement ', 'action resets. ']
    return actions[option]

def pol_result(call):
    print('What was the result of the point-in-line?')
    print('(0) Point-in-line arrives.')
    print('(1) Point-in-line broken (i.e. point moved out of line).')
    print('(2) Point-in-line misses.')
    print('(3) Opponent beats the blade.')
    option = prompt_answer(3)
    call += update_call_pol(option)
    if option == 0:
        call += award_touch()
    else:
        call = initial(call)
    return call

def update_call_pol(option):
    actions = ['arrives, ', 'is broken. ', 'is no. ', 'is beaten. ']
    return actions[option]

def award_touch():
    return 'touch.'

def no_touch():
    return 'no touch.'

print(initial())
