package ir.assignments.two.a;


import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class DriverUtil {
	public static void main(String[] args) {
		File file = new File(args[0]);
		// String file="do geese see god abba bat tab";
		ArrayList<String> words = Utilities.tokenizeFile(file);

		// ArrayList<String> a=(Utilities.tokenizeFile("Lorem ipsum dolor sit
		// amet, consectetur adipiscing elit. Nunc ligula orci, aliquam nec
		// purus sed, facilisis mattis est. Curabitur sed sodales ligula. Sed
		// sit amet ipsum at magna tempus convallis."));
		System.out.println(words);

		//
		// List<Frequency> freq=new ArrayList<Frequency>();
		// freq.add(new Frequency("you think",2));
		// freq.add(new Frequency("how you",1));
		// freq.add(new Frequency("know how",1));
		// freq.add(new Frequency("think you",1));
		// freq.add(new Frequency("you know",1));
		// Utilities.printFrequencies(freq);

		/*
		 * you think 2 how you 1 know how 1 think you 1 you know 1
		 */
	}
}
