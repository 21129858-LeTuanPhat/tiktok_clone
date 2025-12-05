import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import 'tippy.js/animations/scale.css';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import Tippy from '@tippyjs/react/headless';
import styled from 'styled-components';
import { useSpring, motion } from 'framer-motion';

import MenuItem from './MenuItem';
import Header from './Header';
import { useState } from 'react';

const cx = classNames.bind(styles);

const defaultFn = () => {};

const Box = styled(motion.div)``;

function Menu({ children, items = [], hideOnClick = false, onChange = defaultFn }) {
    const [history, setHistory] = useState([{ data: items }]);
    const current = history[history.length - 1];
    const springConfig = { damping: 15, stiffness: 300 };
    // const initialScale = 0.5;
    const opacity = useSpring(0, springConfig);
    // const scale = useSpring(initialScale, springConfig);

    function onMount() {
        // scale.set(1);
        opacity.set(1);
        setHistory((prev) => prev.slice(0, 1));
    }

    function onHide({ unmount }) {
        // const cleanup = scale.onChange((value) => {
        //     if (value <= initialScale) {

        //     }
        // });
        const cleanup = opacity.on('Change', (value) => {
            if (value <= 0.01) {
                // Khi opacity gần = 0
                cleanup(); // Dọn dẹp listener
                unmount(); // Unmount component
            }
        });
        opacity.set(0);

        // scale.set(initialScale);

        // cleanup();
        // unmount();
    }

    const renderItems = () => {
        return current.data.map((item, index) => {
            const isParrent = !!item.children;

            return (
                <MenuItem
                    key={index}
                    data={item}
                    onClick={() => {
                        if (isParrent) {
                            setHistory((prev) => {
                                return [...prev, item.children];
                            });
                        } else {
                            onChange(item);
                        }
                    }}
                />
            );
        });
    };

    return (
        <Tippy
            // delay={[0, 300]}

            interactive
            placement="bottom-end"
            offset={[12, 8]}
            hideOnClick={hideOnClick}
            render={(attrs) => {
                return (
                    <Box style={{ opacity }} tabIndex="-1" {...attrs}>
                        <div className={cx('menu-list')}>
                            <PopperWrapper className={cx('menu-popper')}>
                                {history.length > 1 && (
                                    <Header
                                        title="Language"
                                        onBack={() => {
                                            setHistory((prev) => prev.slice(0, prev.length - 1));
                                        }}
                                    />
                                )}

                                <div className={cx('menu-body')}>{renderItems()}</div>
                            </PopperWrapper>
                        </div>
                    </Box>
                );
            }}
            animation={true}
            onMount={onMount}
            onHide={onHide}
        >
            {children}
        </Tippy>
    );
}

export default Menu;
