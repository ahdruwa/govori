import { Grid } from '@material-ui/core';
import React, {
	memo,
	ReactChild,
	ReactNode,
	ReactNodeArray,
	useEffect,
	useRef,
} from 'react';

type Props = {
	children?: ReactNode | ReactNodeArray;
};

const RoomVideo = ({ children }: Props) => {
	let row: ReactNode[] = [];
	const rows: ReactNode[][] = [];

	if (Array.isArray(children)) {
		children?.forEach((node) => {
			row.push(node);

			if (row.length > rows.length + 1) {
				rows.push(row);
				row = [];
			}
		});
	} else {
		row.push(children);
	}

	rows.push(row);

	return (
		<>
			{rows.map((_row, i) => {
				return (
					<Grid
						container
						justify="center"
						item-aligment="center"
						direction="row"
						spacing={5}
						// key={_row.toString()}
					>
						{_row.map((node, j) => {
							return (
								<Grid xs={6} item>
									{node}
								</Grid>
							);
						})}
					</Grid>
				);
			})}
		</>
	);
};

RoomVideo.defaultProps = {
	children: null,
};

export default RoomVideo;
